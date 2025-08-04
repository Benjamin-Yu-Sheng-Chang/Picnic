

import { components } from "../_generated/api";
import { Resend } from "@convex-dev/resend";
import { mutation, query } from "../_generated/server";
import { alphabet, generateRandomString } from "oslo/crypto";
import { ConvexError, v } from "convex/values";
import { checkDiscordIdArgs, CheckDiscordIdArgs, CreateUserArgs, createUserValidator, VerifyOTPArgs } from "type";

export const resend: Resend = new Resend(components.resend, {
  apiKey: process.env.RESEND_API_KEY!,
  testMode: false,
});

export const sendOTP = mutation({
  args: createUserValidator,
  handler: async (ctx, args: CreateUserArgs) => {
   
    const existingEmail = await ctx.db.query("users").withIndex("email", q => q.eq("email", args.email)).first();
    if (existingEmail) {
      throw new ConvexError("Email already exists");
    }
    const existingUser = await ctx.db.query("users").withIndex("discordUserId", q => q.eq("discordUserId", args.discordUserId)).first();
    if (existingUser) {
      throw new ConvexError("Discord account already exists");
    }

    const existingVerificationCode = await ctx.db.query("discordVerificationCodes").withIndex("discordUserId", q => q.eq("discordUserId", args.discordUserId)).first();
    if (existingVerificationCode) {
      throw new ConvexError("Verification code already exists");
    }

    const code = generateRandomString(6, alphabet("0-9"));
    await ctx.db.insert("discordVerificationCodes", {
      discordUserId: args.discordUserId,
      discordUsername: args.discordUsername,
      discordDiscriminator: args.discordDiscriminator,
      email: args.email,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    const resendResult = await resend.sendEmail(ctx, {
      from: `${process.env.RESEND_SENDER!}`,
      to: args.email,
      subject: `Your Picnic Bot One Time Password`,
      html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f9f9f9; border-radius: 12px;">
            <div style="text-align: center; padding: 25px 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
              <div style="display: inline-block; padding: 8px 16px; background-color: #5865F2; border-radius: 20px; margin-bottom: 15px;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600;">🔗 DISCORD LINK</span>
              </div>
              <h2 style="color: #222222; margin: 0; font-weight: 600;">Link Your Discord Account</h2>
              <p style="color: #666666; margin: 10px 0 0 0; font-size: 14px;">Connect @${args.discordUsername} to Picnic</p>
            </div>
            
            <div style="padding: 35px 25px; text-align: center; background-color: #ffffff; margin-top: 20px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
              <p style="font-size: 18px; color: #444444; margin-bottom: 25px;">Your verification code:</p>
              
              <div style="font-size: 42px; font-weight: bold; color: #5865F2; letter-spacing: 8px; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #f5f5ff 0%, #e8e8ff 100%); border-radius: 12px; border: 2px solid #5865F2; text-shadow: 0 2px 4px rgba(88,101,242,0.1);">
                ${code}
              </div>
              
              <div style="background-color: #fef3cd; border: 1px solid #fecf47; border-radius: 8px; padding: 15px; margin: 25px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px; font-weight: 600;">⏰ This code expires in 10 minutes</p>
              </div>
              
              <div style="text-align: left; background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #444444; margin: 0 0 15px 0; font-size: 16px;">How to complete linking:</h4>
                <ol style="color: #666666; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Return to Discord</li>
                  <li style="margin-bottom: 8px;">Use command: <code style="background-color: #e9ecef; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace;">/verify-link ${code}</code></li>
                  <li style="margin-bottom: 0;">Your accounts will be linked! 🎉</li>
                </ol>
              </div>
              
              <p style="font-size: 13px; color: #dc3545; margin: 20px 0 0 0; font-weight: 500;">🔒 Keep this code private and don't share it with anyone</p>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 13px; color: #888888; margin-top: 20px;">
              <p style="margin: 0;">If you didn't request this linking, you can safely ignore this email.</p>
              <p style="margin: 10px 0 0 0;">The code will expire automatically for your security.</p>
              <p style="margin-top: 15px;">&copy; Picnic Bot - Automated Discord Integration</p>
            </div>
          </div>
          `,
    });
    return resendResult;
  },
});

export const verifyOTP = mutation({
  args: {
    token: v.string(),
    discordUserId: v.string(),
  },
  handler: async (ctx, args: VerifyOTPArgs) => {
    const discordVerificationCodes = await ctx.db.query("discordVerificationCodes").withIndex("discordUserId", q => q.eq("discordUserId", args.discordUserId)).first();
    if (!discordVerificationCodes || discordVerificationCodes.code !== args.token || discordVerificationCodes.expiresAt < Date.now() || discordVerificationCodes.usedAt) {
      throw new ConvexError("Invalid token");
    }
    const existingUser = await ctx.db.query("users").withIndex("discordUserId", q => q.eq("discordUserId", args.discordUserId)).first();
    if (existingUser) {
      throw new ConvexError("Discord account already exists");
    }
    await ctx.db.insert("users", {
      discordUserId: args.discordUserId,
      discordUsername: discordVerificationCodes.discordUsername,
      discordDiscriminator: discordVerificationCodes.discordDiscriminator,
      email: discordVerificationCodes.email,
      createdAt: Date.now(),
      verifiedAt: Date.now(),
    });
    await ctx.db.patch(discordVerificationCodes._id, {
      usedAt: Date.now(),
    });
    return true;
  },
});

export const checkDiscordId = mutation({
  args: checkDiscordIdArgs,
  handler: async (ctx, args: CheckDiscordIdArgs) => {
    const user = await ctx.db.query("users").withIndex("discordUserId", q => q.eq("discordUserId", args.discordUserId)).first();
    return !!user;
  },
});